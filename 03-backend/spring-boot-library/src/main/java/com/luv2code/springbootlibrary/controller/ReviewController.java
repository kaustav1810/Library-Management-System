package com.luv2code.springbootlibrary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.luv2code.springbootlibrary.dao.ReviewRepository;
import com.luv2code.springbootlibrary.requestmodels.ReviewRequest;
import com.luv2code.springbootlibrary.service.ReviewService;
import com.luv2code.springbootlibrary.utils.ExtractJWT;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    
    private ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService){
        this.reviewService = reviewService;
    }

    
    @GetMapping("/secure/user/book")
    private Boolean checkBookReviewed(@RequestHeader("Authorization") String token,@RequestParam("bookId") Long bookId)
    throws Exception{
        
        String userEmail = ExtractJWT.JWTPayloadExtractor(token, "\"sub\"");
        
        if(userEmail==null)
        throw new Exception("user email is missing");
        
        return reviewService.validateBookReview(userEmail, bookId);
    }
    @PostMapping("/secure")
    private void postReview(@RequestHeader("Authorization") String token,
    @RequestBody ReviewRequest reviewRequest) throws Exception{
    
        String userEmail = ExtractJWT.JWTPayloadExtractor(token, "\"sub\"");
    
        if(userEmail==null)
        throw new Exception("user email is missing");
    
        reviewService.postReview(userEmail, reviewRequest);
    }
}
