package com.luv2code.springbootlibrary.utils;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import javax.websocket.Decoder;

public class ExtractJWT {
    
    public static String JWTPayloadExtractor(String token,String extractor){

        String authToken = token.replace("Bearer", "");

        String[] chunks = authToken.split("\\.");

        String encodedPayload = chunks[1];

        Base64.Decoder decoder = Base64.getUrlDecoder();

        String decodedPayload = new String( decoder.decode(encodedPayload));

        String[] fields = decodedPayload.split(",");

        Map<String,String> keyValues = new HashMap<>();

        for(String field:fields){

            String[] item = field.split(":");
            

            if(item[0].equals(extractor)){

                int remove = 1;
                if (item[1].endsWith("}")) {
                    remove = 2;
                }
                item[1] = item[1].substring(0, item[1].length() - remove);
                item[1] = item[1].substring(1);

                keyValues.put(item[0],item[1]);
            }
        }

        return keyValues.get(extractor);
    }
}
