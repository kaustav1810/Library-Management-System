package com.luv2code.springbootlibrary.service;

import java.sql.Date;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.luv2code.springbootlibrary.Entity.Book;
import com.luv2code.springbootlibrary.Entity.Review;
import com.luv2code.springbootlibrary.dao.BookRepository;
import com.luv2code.springbootlibrary.dao.ReviewRepository;
import com.luv2code.springbootlibrary.requestmodels.ReviewRequest;

@Service
@Transactional
public class ReviewService {
    
    private ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository){
        this.reviewRepository = reviewRepository;
    }

    public void postReview(String userEmail,ReviewRequest reviewRequest) throws Exception{

        Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, reviewRequest.getBookId());

        if(validateReview!=null)
        throw new Exception("Review already exists!!");

        Review review = new Review();

        review.setBookId(reviewRequest.getBookId());
        review.setDate(Date.valueOf(LocalDate.now()));
        review.setRating(reviewRequest.getRating());
        review.setUserEmail(userEmail);

        if(reviewRequest.getReviewDescription().isPresent()){

            review.setReviewDescription(reviewRequest.getReviewDescription().map(
                Object::toString
            ).orElse(null));
        }

        reviewRepository.save(review);
    }

    public Boolean validateBookReview(String userEmail,Long bookId){

        Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, bookId);

        return validateReview!=null?true:false;
    }

}
