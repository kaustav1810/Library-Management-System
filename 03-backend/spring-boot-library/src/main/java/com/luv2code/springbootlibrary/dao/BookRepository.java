package com.luv2code.springbootlibrary.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import com.luv2code.springbootlibrary.Entity.Book;


public interface BookRepository extends JpaRepository<Book,Long> {
    
    Page<Book> findByTitleContaining(@RequestParam("title") String title,Pageable Pageable);
    
    Page<Book> findByCategory(@RequestParam("category") String category,Pageable Pageable);

    @Query("select o from Book o where id in :book_ids")
    List<Book> findBookByBookIds(@Param("book_ids") List<Long> bookIds);
}
