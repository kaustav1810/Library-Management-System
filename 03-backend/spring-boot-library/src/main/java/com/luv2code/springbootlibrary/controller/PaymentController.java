package com.luv2code.springbootlibrary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luv2code.springbootlibrary.requestmodels.PaymentInfoRequest;
import com.luv2code.springbootlibrary.service.PaymentService;
import com.luv2code.springbootlibrary.utils.ExtractJWT;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

@CrossOrigin("https://localhost:3000/")
@RestController
@RequestMapping("/api/payment/secure")
public class PaymentController {
    

    private PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService){
        this.paymentService = paymentService;
    }

    
    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfoRequest paymentInfoRequest) throws StripeException{

        PaymentIntent paymentIntent = paymentService.createPaymentIntent(paymentInfoRequest);

        String paymentStr = paymentIntent.toJson();

        return new ResponseEntity<>(paymentStr,HttpStatus.OK);
        
    }

    @PutMapping("/payment-complete")
    public ResponseEntity<String> stripePayment(@RequestHeader(value = "Authorization") String token) throws Exception{
        
        String userEmail = ExtractJWT.JWTPayloadExtractor(token, "\"sub\"");

        if(userEmail==null) throw new Exception("user does not exists");

        return paymentService.stripePayment(userEmail);
    }

}
