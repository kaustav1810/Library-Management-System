package com.luv2code.springbootlibrary.requestmodels;

import lombok.Data;

@Data
public class PaymentInfoRequest {
    
    private String receiptEmail;

    private String currency;

    private int amount;
}
