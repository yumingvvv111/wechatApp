package com.sstm888labs.restexample.springmvc.api;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.sstm888labs.restexample.springmvc.Constants;
import com.sstm888labs.restexample.springmvc.domain.MyPage;
import com.sstm888labs.restexample.springmvc.domain.MyPageImp;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = Constants.URI_REST + "/weixin")
public class GetTicketController {


    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/getTicket", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<MyPage<Map>> getEquimentData(
            @RequestParam(value = "wxId", required = false) String wxId) {


        JSONObject object = JSON.parseObject("{\n" +
                "  \"nonceStr\": \"yy352a50t66qp68\",\n" +
                "  \"timestamp\": \"1499738074\",\n" +
                "  \"url\": \"\",\n" +
                "  \"signature\": \"24c4f42465141d56c6b69704691be8775537e9fc\",\n" +
                "  \"appid\": \"wx5246e0bfe2bb346c\",\n" +
                "  \"secret\": \"8d1bef8ca4b8142af3a1db5b1cd85100\",\n" +
                "  \"token\": \"9VaDDRWg1NqfAIW51L5O5etJLGiNBEky0AjAi4FOj63LMFYg40HbgNXgNZCl6pNf2fGJUQBxIjN2elNlLhO5HyqanuyMgwEB81DjkNJ4fmP4UwS1CpRX08dxlmyNXCMBRDAhAAAVHE\",\n" +
                "  \"jsTicket\": \"kgt8ON7yVITDhtdwci0qeY5DfMAlrVuBJ7eeNUeZ9jTZChUm0sSkLpugwz3IsZZ_dedeXsr2vuyAvOL0lckY9A\"\n" +
                "}");
        MyPage<Map> page = new MyPageImp<>(object);

        return new ResponseEntity<>(page, HttpStatus.OK);
    }
    
   
}
