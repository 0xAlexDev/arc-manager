package com.arc_manager.domain.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RestErrorResponse {

    String message;

    public ResponseEntity<RestErrorResponse> toResponseEntity(Integer statusCode){
        return ResponseEntity.status(statusCode).body(this);
    }

}
