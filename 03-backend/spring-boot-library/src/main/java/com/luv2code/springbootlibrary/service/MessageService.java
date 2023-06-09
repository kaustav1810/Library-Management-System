package com.luv2code.springbootlibrary.service;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.luv2code.springbootlibrary.Entity.Message;
import com.luv2code.springbootlibrary.dao.MessageRepository;
import com.luv2code.springbootlibrary.requestmodels.AdminQuestionRequest;

@Service
@Transactional
public class MessageService {
    
    private MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository){
        this.messageRepository = messageRepository;
    }

    public void postMessage(Message messageRequest,String userEmail){

        Message message = new Message(messageRequest.getTitle(),messageRequest.getQuestion());

        message.setUserEmail(userEmail);

        messageRepository.save(message);
    }

    public void putMessage(AdminQuestionRequest adminQuestionRequest,String email) throws Exception{

        Optional<Message> message = messageRepository.findById(adminQuestionRequest.getId());

        if(!message.isPresent()) throw new Exception("message not present");

        message.get().setAdminEmail(email);
        message.get().setResponse(adminQuestionRequest.getResponse());
        message.get().setClosed(true);

        messageRepository.save(message.get());
    }

}
