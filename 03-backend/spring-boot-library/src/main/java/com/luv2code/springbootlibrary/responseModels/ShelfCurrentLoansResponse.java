package com.luv2code.springbootlibrary.responseModels;

import com.luv2code.springbootlibrary.Entity.Book;

import lombok.Data;

@Data
public class ShelfCurrentLoansResponse{


    public ShelfCurrentLoansResponse(Book book,int daysLeft){
        this.book = book;
        this.daysLeft = daysLeft;
    }

    private Book book;

    private int daysLeft;
}