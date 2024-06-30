package com.codegym.controller;

import com.codegym.model.Classes;
import com.codegym.service.IClassesService;
import com.codegym.service.IStudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/api/classes")
public class ClassesController {
    @Autowired
    private IClassesService classesService;

    @Autowired
    private IStudentService studentService;

    @GetMapping
    public ResponseEntity<Iterable<Classes>> findAllClasses(){
        List<Classes> classes = (List<Classes>) classesService.findAll();
        if (classes.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(classes, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Classes> findClassesById(@PathVariable Long id) {
        Optional<Classes> classesOptional = classesService.findById(id);
        if (!classesOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(classesOptional.get(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Classes> saveClasses(@RequestBody Classes classes) {
        return new ResponseEntity<>(classesService.save(classes), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Classes> updateClasses(@PathVariable Long id, @RequestBody Classes classes) {
        Optional<Classes> classesOptional = classesService.findById(id);
        if (!classesOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        classes.setId(classesOptional.get().getId());
        return new ResponseEntity<>(classesService.save(classes), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Classes> deleteClasses(@PathVariable Long id) {
        Optional<Classes> classesOptional = classesService.findById(id);
        if (!classesOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        classesService.remove(id);
        return new ResponseEntity<>(classesOptional.get(), HttpStatus.OK);
    }
}
