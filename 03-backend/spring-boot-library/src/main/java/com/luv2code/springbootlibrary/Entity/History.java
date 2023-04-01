package com.luv2code.springbootlibrary.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Data
@Table(name = "History")
public class History {
    
    public History(){}

    public History(String userEmail,String checkoutDate,String returnedDate,String title,
    String author,String description,String img){
        this.userEmail = userEmail;
        this.checkoutDate = checkoutDate;
        this.returnedDate = returnedDate;
        this.title = title;
        this.author = author;
        this.description = description;
        this.img = img;
    }

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name="user_email")
    public String userEmail;

    @Column(name = "checkout_date")
    public String checkoutDate;

    @Column(name = "returned_date")
    public String returnedDate;
    
    @Column(name = "title")
    public String title;
    
    @Column(name = "author")
    public String author;
    
    @Column(name="description")
    public String description;
    
    @Column(name="img")
    public String img;
}
