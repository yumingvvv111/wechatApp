package com.sstm888labs.restexample.springmvc.api;

import com.sstm888labs.restexample.springmvc.Constants;
import com.sstm888labs.restexample.springmvc.domain.MyPage;
import com.sstm888labs.restexample.springmvc.domain.MyPageImp;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping(value = Constants.URI_REST + "/pageToken")
public class GetCodeController {


    @CrossOrigin(origins = "*")
    @RequestMapping("/getCode")
    public ResponseEntity<MyPage<Map>> getCode(
            @RequestParam(value = "code", required = false) String code) {

        Map<String, Object> map = new HashMap<>();
        map.put("WXId", "oOTfGjrnQYbzF7qDKyzK_SZh3qkw");
        MyPage<Map> myPage = new MyPageImp<Map>(map);
        return new ResponseEntity<>(myPage, HttpStatus.OK);
    }
    
   
}
