package com.luv2code.springbootlibrary.service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.luv2code.springbootlibrary.Entity.Book;
import com.luv2code.springbootlibrary.Entity.Checkout;
import com.luv2code.springbootlibrary.Entity.History;
import com.luv2code.springbootlibrary.Entity.Payment;
import com.luv2code.springbootlibrary.dao.BookRepository;
import com.luv2code.springbootlibrary.dao.CheckoutRepository;
import com.luv2code.springbootlibrary.dao.HistoryRepository;
import com.luv2code.springbootlibrary.dao.PaymentRepository;
import com.luv2code.springbootlibrary.responseModels.ShelfCurrentLoansResponse;

@Service
@Transactional
public class BookService {

    private BookRepository bookRepository;
    private CheckoutRepository checkoutRepository;
    private HistoryRepository historyRepository;
    private PaymentRepository paymentRepository;

    public BookService(HistoryRepository historyRepository, BookRepository bookRepository,
            CheckoutRepository checkoutRepository,
            PaymentRepository paymentRepository) {
        this.historyRepository = historyRepository;
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.paymentRepository = paymentRepository;
    }

    public Book checkoutService(String userEmail, Long bookId) throws Exception {

        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        List<Checkout> checkedoutBooks = checkoutRepository.findByUserEmail(userEmail);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        boolean isDue = false;

        for (Checkout ch : checkedoutBooks) {
            Date d1 = sdf.parse(ch.getReturnDate());
            Date d2 = sdf.parse(LocalDate.now().toString());

            TimeUnit time = TimeUnit.DAYS;

            double timeDiff = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);


            if (timeDiff < 0) {
                isDue = true;
                break;
            }

        }

        Payment userPayment = paymentRepository.findByUserEmail(userEmail);

        // System.out.println("amountDue: "+userPayment+" isDue: "+isDue+" getAmount: "+userPayment.getAmount());

        if ( (userPayment != null && isDue) || (userPayment!=null && userPayment.getAmount()>0))
            throw new Exception("Overdue Yaaar!!");

        else {
            Payment payment = userPayment==null?new Payment():userPayment;
            
            payment.setAmount(00.00);
            payment.setUserEmail(userEmail);
            paymentRepository.save(payment);
        }

        if (!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <= 0) {
            throw new Exception("book is out of stock or already checked out");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());

        Checkout checkoutBook = new Checkout(userEmail,
                LocalDate.now().toString(),
                book.get().getId(),
                LocalDate.now().plusDays(7).toString());

        checkoutRepository.save(checkoutBook);

        return book.get();
    }

    public boolean isCheckedout(String userEmail, Long bookId) {

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        return validateCheckout == null ? false : true;
    }

    public int getCurrentLoans(String userEmail) {

        return checkoutRepository.findByUserEmail(userEmail).size();
    }

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {
        List<ShelfCurrentLoansResponse> loans = new ArrayList<>();

        List<Checkout> checkouts = checkoutRepository.findByUserEmail(userEmail);

        List<Long> bookIds = new ArrayList<>();

        for (Checkout ch : checkouts) {
            bookIds.add(ch.getBookId());
        }

        List<Book> books = bookRepository.findBookByBookIds(bookIds);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for (Book b : books) {
            Optional<Checkout> ch = checkouts.stream().filter(x -> x.getBookId() == b.getId()).findFirst();

            if (ch.isPresent()) {
                Date d1 = sdf.parse(ch.get().getReturnDate());

                Date d2 = sdf.parse(LocalDate.now().toString());

                TimeUnit tu = TimeUnit.DAYS;

                long timediff = tu.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

                loans.add(new ShelfCurrentLoansResponse(b, (int) timediff));
            }

        }

        return loans;
    }

    public void returnBook(String userEmail, Long bookId) throws Exception {

        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (!book.isPresent() || validateCheckout == null)
            throw new Error("book not present or not checked out");

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        Date d1 = sdf.parse(validateCheckout.getReturnDate());
        Date d2 = sdf.parse(LocalDate.now().toString());

        TimeUnit time = TimeUnit.DAYS;

        double timeDiff = time.convert(d1.getTime() - d2.getTime(), time.MILLISECONDS);

        if (timeDiff < 0) {
            Payment payment = paymentRepository.findByUserEmail(userEmail);

            payment.setAmount(payment.getAmount() + (timeDiff * -1));

            paymentRepository.save(payment);
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);

        bookRepository.save(book.get());

        checkoutRepository.deleteById(validateCheckout.getId());

        History history = new History(
                userEmail,
                validateCheckout.getCheckoutDate(),
                LocalDate.now().toString(),
                book.get().getTitle(),
                book.get().getAuthor(),
                book.get().getDescription(),
                book.get().getImg()

        );

        historyRepository.save(history);
    }

    public void renewLoan(String userEmail, Long bookId) throws Exception {

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (validateCheckout == null)
            throw new Error("oops!! Book already checked out");

        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy-MM-dd");

        Date d1 = sdFormat.parse(validateCheckout.getCheckoutDate());
        Date d2 = sdFormat.parse(LocalDate.now().toString());

        if (d1.compareTo(d2) >= 0) {
            validateCheckout.setCheckoutDate(LocalDate.now().plusDays(7).toString());
            System.out.println("New Renewal date: " + validateCheckout.getCheckoutDate());
            checkoutRepository.save(validateCheckout);
        }

    }

}
