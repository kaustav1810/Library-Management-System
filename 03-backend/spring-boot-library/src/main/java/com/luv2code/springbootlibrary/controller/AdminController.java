package com.luv2code.springbootlibrary.controller;

import org.springframework.boot.autoconfigure.kafka.KafkaProperties.Admin;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.luv2code.springbootlibrary.requestmodels.AddBookRequest;
import com.luv2code.springbootlibrary.service.AdminService;
import com.luv2code.springbootlibrary.utils.ExtractJWT;

@CrossOrigin("https://localhost:3000/")
@RestController
@RequestMapping("/api/admin/")
public class AdminController {
    
    public AdminService adminService;

    public AdminController(AdminService adminService){
        this.adminService = adminService;
    }

    @PutMapping("/secure/increase/book/quantity")
    public void increaseBookQuantity(@RequestHeader(value = "Authorization") String token,
    @RequestParam Long bookId) throws Exception{

        String admin = ExtractJWT.JWTPayloadExtractor(token, "\"userType\"");

        if(admin==null || !admin.equals("admin")) throw new Exception("Admin only access");

        adminService.increaseBookQuantity(bookId);
    }

    @PutMapping("/secure/decrease/book/quantity")
    public void decreaseBookQuantity(@RequestHeader(value = "Authorization") String token,
    @RequestParam Long bookId) throws Exception{

        String admin = ExtractJWT.JWTPayloadExtractor(token, "\"userType\"");

        if(admin==null || !admin.equals("admin")) throw new Exception("Admin only access");

        adminService.decreaseBookQuantity(bookId);
    }

    @PostMapping("/secure/add/book")
    public void addBook(@RequestHeader(value = "Authorization") String token,@RequestBody AddBookRequest addBookRequest)
    throws Exception{
        String admin = ExtractJWT.JWTPayloadExtractor(token, "\"userType\"");

        if(admin==null || !admin.equals("admin")) throw new Error("Admin only page"); 
        
        adminService.postBook(addBookRequest);
    }

    @DeleteMapping("/secure/delete/book")
    public void deleteBook(@RequestHeader(value = "Authorization") String token,
    @RequestParam Long bookId) throws Exception{

        String admin = ExtractJWT.JWTPayloadExtractor(token, "\"userType\"");

        if(admin==null || !admin.equals("admin"))
            throw new Exception("Admin only access");

        adminService.deleteBook(bookId);
    }
}
