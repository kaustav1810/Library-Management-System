package com.luv2code.springbootlibrary.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.luv2code.springbootlibrary.Entity.Payment;

import lombok.Value;

public interface PaymentRepository extends JpaRepository<Payment,Long> {
    
    Payment findByUserEmail(String userEmail);
}
