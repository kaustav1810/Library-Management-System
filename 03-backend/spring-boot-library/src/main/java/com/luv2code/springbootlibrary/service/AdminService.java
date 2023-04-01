package com.luv2code.springbootlibrary.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.luv2code.springbootlibrary.Entity.Book;
import com.luv2code.springbootlibrary.dao.BookRepository;
import com.luv2code.springbootlibrary.dao.CheckoutRepository;
import com.luv2code.springbootlibrary.dao.ReviewRepository;
import com.luv2code.springbootlibrary.requestmodels.AddBookRequest;

@Service
@Transactional
public class AdminService {
    
    public BookRepository bookRepository;
    public ReviewRepository reviewRepository;

    public CheckoutRepository checkoutRepository;

    public AdminService(BookRepository bookRepository,
    CheckoutRepository checkoutRepository,ReviewRepository reviewRepository){
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
        this.checkoutRepository = checkoutRepository;
    }

    public void increaseBookQuantity(Long bookId) throws Exception{

        Optional<Book> book = bookRepository.findById(bookId);

        if(!book.isPresent()) throw new Exception("Book is not available");

        book.get().setCopies(book.get().getCopies()+1);
        book.get().setCopiesAvailable(book.get().getCopiesAvailable()+1);

        bookRepository.save(book.get());

    }

    public void decreaseBookQuantity(Long bookId) throws Exception{

        Optional<Book> book = bookRepository.findById(bookId);

        if(!book.isPresent() || book.get().getCopies()<=0 || book.get().getCopiesAvailable()<=0 )
         throw new Exception("Book is not available");

        book.get().setCopies(book.get().getCopies()-1);
        book.get().setCopiesAvailable(book.get().getCopiesAvailable()-1);

        bookRepository.save(book.get());

    }

    public void postBook(AddBookRequest addBookRequest){
        Book book = new Book();

        book.setAuthor(addBookRequest.getAuthor());
        book.setCategory(addBookRequest.getCategory());
        book.setCopies(addBookRequest.getCopies());
        book.setCopiesAvailable(addBookRequest.getCopiesAvailable());
        book.setDescription(addBookRequest.getDescription());
        book.setTitle(addBookRequest.getTitle());
        book.setImg(addBookRequest.getImage());
        
        System.out.println(book.getId());

        bookRepository.save(book);
    }

    public void deleteBook(Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);

        if(!book.isPresent()) throw new Exception("Book Not Found");

        bookRepository.delete(book.get());
        reviewRepository.deleteAllByBookId(bookId);
        checkoutRepository.deleteAllByBookId(bookId);
    }
}
