package com.luv2code.springbootlibrary.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.luv2code.springbootlibrary.Entity.Message;
import com.luv2code.springbootlibrary.requestmodels.AdminQuestionRequest;
import com.luv2code.springbootlibrary.service.MessageService;
import com.luv2code.springbootlibrary.utils.ExtractJWT;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    private MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService){
        this.messageService = messageService;
    }

    @PostMapping("/secure/add/message")
    public void postMessage(@RequestHeader(value = "Authorization") String token,
    @RequestBody Message messageRequest){
        String userEmail = ExtractJWT.JWTPayloadExtractor(token, "\"sub\"");
        
        messageService.postMessage(messageRequest, userEmail);
    }
    
    @PutMapping("/secure/admin/message")
    public void putMessage(@RequestHeader("Authorization") String token,@RequestBody AdminQuestionRequest adminQuestionRequest)
    throws Exception{
        
        String adminEmail = ExtractJWT.JWTPayloadExtractor(token, "\"sub\"");
        
        String admin = ExtractJWT.JWTPayloadExtractor(token, "\"userType\"");
        
        if(admin==null || !admin.equals("admin")) throw new Exception("Admin only access!");
        
        messageService.putMessage(adminQuestionRequest, adminEmail);
    }
    

}
