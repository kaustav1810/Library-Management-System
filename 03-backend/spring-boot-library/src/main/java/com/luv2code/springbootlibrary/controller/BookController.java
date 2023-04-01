package com.luv2code.springbootlibrary.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.luv2code.springbootlibrary.Entity.Book;
import com.luv2code.springbootlibrary.Entity.History;
import com.luv2code.springbootlibrary.responseModels.ShelfCurrentLoansResponse;
import com.luv2code.springbootlibrary.service.BookService;
import com.luv2code.springbootlibrary.utils.ExtractJWT;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {
    
    private BookService bookService;

    @Autowired
    public BookController(BookService bookService){
        this.bookService = bookService;
    }
    
    @GetMapping("/secure/currentLoans")
    public List<ShelfCurrentLoansResponse> getShelfCurrentLoans(@RequestHeader("Authorization") String token) throws Exception{
        
        String userEmail = ExtractJWT.JWTPayloadExtractor(token,"\"sub\"");

        return bookService.currentLoans(userEmail);
    }
    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestHeader("Authorization") String token,@RequestParam("bookId") Long bookId) throws Exception{

        String userEmail = ExtractJWT.JWTPayloadExtractor(token,"\"sub\"");
        
        return bookService.checkoutService(userEmail, bookId);
    }
    
    @GetMapping("/secure/checkout/isCheckedout")
    public Boolean isCheckedout(@RequestHeader("Authorization") String token,@RequestParam("bookId") Long bookid){
        
        String userEmail = ExtractJWT.JWTPayloadExtractor(token,"\"sub\"");
        
        return bookService.isCheckedout(userEmail, bookid);
    }
    
    @GetMapping("/secure/checkout/currentLoans")
    public int getCurrentLoans(@RequestHeader("Authorization") String token){
        
        String userEmail = ExtractJWT.JWTPayloadExtractor(token,"\"sub\"");

        return bookService.getCurrentLoans(userEmail);
    }

    @PutMapping("/secure/return")
    public void returnBook(@RequestHeader("Authorization") String token,
    @RequestParam("bookId") Long bookId
    ) throws Exception{

        String userEmail = ExtractJWT.JWTPayloadExtractor(token, "\"sub\"");

        System.out.println(userEmail);

        bookService.returnBook(userEmail, bookId);
    }

    @PutMapping("/secure/renew/loan")
    public void renewLoan(@RequestHeader("Authorization") String token,
    @RequestParam("bookId") Long bookId) throws Exception{

        String userEmail = ExtractJWT.JWTPayloadExtractor(token, "\"sub\"");
        
        bookService.renewLoan(userEmail, bookId);
    }
    
}
