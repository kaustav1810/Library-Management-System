package com.luv2code.springbootlibrary.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.luv2code.springbootlibrary.Entity.Payment;
import com.luv2code.springbootlibrary.dao.PaymentRepository;
import com.luv2code.springbootlibrary.requestmodels.PaymentInfoRequest;
import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

@Service
@Transactional
public class PaymentService {
    
    
    public PaymentRepository paymentRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository,@Value("${stripe.key.secret}") String key){
        this.paymentRepository = paymentRepository;
        Stripe.apiKey = key;
    }


    public PaymentIntent createPaymentIntent(PaymentInfoRequest paymentInfoRequest) throws StripeException{

        List<String> paymentMethodTypes = new ArrayList<>();

        paymentMethodTypes.add("card");

        Map<String,Object> params = new HashMap<>();

        params.put("currency",paymentInfoRequest.getCurrency());
        params.put("amount",paymentInfoRequest.getAmount());
        params.put("payment_method_types",paymentMethodTypes);

        return PaymentIntent.create(params);
    }

    public ResponseEntity<String> stripePayment(String userEmail){

        Payment payment = paymentRepository.findByUserEmail(userEmail);

        if(payment==null) throw new Error("Payment info is required");

        payment.setAmount(00.00);
        paymentRepository.save(payment);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
