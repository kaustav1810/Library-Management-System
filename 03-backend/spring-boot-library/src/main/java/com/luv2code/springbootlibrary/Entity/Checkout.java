package com.luv2code.springbootlibrary.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name = "checkout")
public class Checkout {
    
    public Checkout(){};

    public Checkout(String userEmail,String checkoutDate,Long bookId,String returnDate){
        this.userEmail = userEmail;
        this.checkoutDate = checkoutDate;
        this.bookId = bookId;
        this.returnDate =returnDate;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    Long id;

    @Column(name = "checkout_date")
    String checkoutDate;

    @Column(name = "return_date")
    String returnDate;

    @Column(name = "book_id")
    Long bookId;

    @Column(name = "user_email")
    String userEmail;

    
}
