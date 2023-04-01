package com.luv2code.springbootlibrary.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RequestParam;

import com.luv2code.springbootlibrary.Entity.Message;

public interface MessageRepository extends JpaRepository<Message,Long> {
    
    Page<Message> findByUserEmail(@RequestParam("user_email") String userEmail,Pageable pageable);

    Page<Message> findByClosed(@RequestParam("closed") boolean closed,Pageable pageable);
}