package com.arc_manager.components;

import com.arc_manager.domain.DTOs.RestErrorResponse;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.security.auth.message.AuthException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.NullValueInNestedPathException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.lang.reflect.*;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    //handle wrong REST method for API
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<RestErrorResponse> handleHandlerNotFoundException(HttpServletRequest request, HttpRequestMethodNotSupportedException e) {

        log.error(e.getMessage());

        return RestErrorResponse.builder()
                .message(e.getMessage())
                .build()
                .toResponseEntity(HttpStatus.BAD_REQUEST.value());

    }

    //works only with GlobalExceptionHandler or specific configurations
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<RestErrorResponse> handleHandlerNotFoundException(HttpServletRequest request, NoHandlerFoundException e) {

        String resourcePath = e.getRequestURL();

        log.error(e.getMessage());

        return RestErrorResponse.builder()
                .message(e.getMessage())
                .build()
                .toResponseEntity(HttpStatus.FORBIDDEN.value());

    }

    //when some validation fails
    @ExceptionHandler({MethodArgumentNotValidException.class, ValidationException.class, NullValueInNestedPathException.class})
    public ResponseEntity<RestErrorResponse> handleValidationException(Exception e, HttpServletRequest request) {
        List<String> errors = new ArrayList<>();

        if (e instanceof MethodArgumentNotValidException manv) {
            manv.getBindingResult()
                    .getFieldErrors()
                    .forEach(fe -> {
                                String translatedField = translateValidationErrorField(fe.getField(),manv);
                                errors.add(String.format("%s: %s", translatedField, fe.getDefaultMessage()));
                            }
                    );
        }
        else if (e instanceof ValidationException ve) {
            errors.add(resolveMessageWithParameterName(ve,request));
        }
        else if (e instanceof NullValueInNestedPathException ve) {
            errors.add(ve.getMessage());
        }
        else {
            errors.add("generic validation error");
        }

        return RestErrorResponse.builder()
                .message(String.join(" - ", errors))
                .build()
                .toResponseEntity(HttpStatus.BAD_REQUEST.value());
    }

    //when required header of the request is missing
    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<RestErrorResponse> handleMissingHeader(MissingRequestHeaderException e) {
        Map<String, String> body = new HashMap<>();
        body.put("headerName", e.getHeaderName());

        log.error(e.getMessage());

        return RestErrorResponse.builder()
                .message(String.format("Missing required request header: %s",e.getHeaderName()))
                .build()
                .toResponseEntity(HttpStatus.BAD_REQUEST.value());

    }

    //when the body of request is malformated
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<RestErrorResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {

        log.error(e.getMessage());

        return RestErrorResponse.builder()
                .message("Not allowed json format for the request body: " + e.getMessage())
                .build()
                .toResponseEntity(HttpStatus.BAD_REQUEST.value());
    }

    //when missing required query params
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<RestErrorResponse> handleMissingServletRequestParameterException(HttpServletRequest request, MissingServletRequestParameterException e) {

        log.error(e.getMessage());

        return RestErrorResponse.builder()
                .message("Not allowed json format for the request body")
                .build()
                .toResponseEntity(HttpStatus.BAD_REQUEST.value());

    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<RestErrorResponse> handleGenericException(HttpServletRequest request, NoHandlerFoundException e) {
        log.error(e.getMessage());

        return RestErrorResponse.builder()
                .message("Internal Server Error")
                .build()
                .toResponseEntity(500);
    }

    //Custom Exceptions

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<RestErrorResponse> handleAuthException(HttpServletRequest request, AuthException e) {
        log.error(e.getMessage());

        return RestErrorResponse.builder()
                .message(e.getMessage())
                .build()
                .toResponseEntity(403);
    }

    //Utils functions

    /*
     * Utility functions to format validation error
     * */

    private String resolveMessageWithParameterName(ValidationException ve, HttpServletRequest request) {
        String rawMessage = ve.getMessage();
        if (rawMessage == null || rawMessage.isBlank()) {
            return "Validation error";
        }

        Pattern pattern = Pattern.compile("arg(\\d+)");
        Matcher matcher = pattern.matcher(rawMessage);

        if (matcher.find()) {
            int index = Integer.parseInt(matcher.group(1));

            Object handlerAttr = request.getAttribute(org.springframework.web.servlet.HandlerMapping.BEST_MATCHING_HANDLER_ATTRIBUTE);
            if (handlerAttr instanceof org.springframework.web.method.HandlerMethod handler) {
                Method method = handler.getMethod();
                Parameter[] parameters = method.getParameters();

                if (index < parameters.length) {
                    Parameter parameter = parameters[index];

                    String readableName = null;
                    String prefix = "";

                    if (parameter.isAnnotationPresent(RequestParam.class)) {
                        RequestParam rp = parameter.getAnnotation(RequestParam.class);
                        readableName = !rp.value().isEmpty() ? rp.value() : parameter.getName();
                        prefix = "QueryParam - ";
                    } else if (parameter.isAnnotationPresent(PathVariable.class)) {
                        PathVariable pv = parameter.getAnnotation(PathVariable.class);
                        readableName = !pv.value().isEmpty() ? pv.value() : parameter.getName();
                        prefix = "PathVariable - ";
                    } else if (parameter.isAnnotationPresent(RequestHeader.class)) {
                        RequestHeader rh = parameter.getAnnotation(RequestHeader.class);
                        readableName = !rh.value().isEmpty() ? rh.value() : parameter.getName();
                        prefix = "Header - ";
                    } else {
                        readableName = parameter.getName();
                    }

                    if (readableName != null && !readableName.isEmpty()) {
                        String replaced = rawMessage.replaceAll("arg\\d+", readableName);
                        return prefix + readableName + ": " + replaced.replaceFirst(".*?:\\s*", "");
                    }
                }
            }
        }

        return rawMessage;
    }

    private String translateValidationErrorField(String errorField, MethodArgumentNotValidException validationException){
        try{
            Object target = validationException.getTarget();
            Class<?> rootClass = target != null ? target.getClass() : null;
            return translatePath(errorField, rootClass);
        } catch (Exception e) {
            return errorField;
        }
    }

    private String translatePath(String path, Class<?> rootClass) {
        if (rootClass == null || path == null || path.isEmpty()) return path;

        String[] parts = path.split("\\.");
        Class<?> currentClass = rootClass;
        StringBuilder sb = new StringBuilder();

        for (String part : parts) {
            String baseName = part.replaceAll("\\[.*?\\]", "");
            String indexPart = part.length() > baseName.length() ? part.substring(baseName.length()) : "";

            Field field = findFieldInHierarchy(currentClass, baseName);
            String jsonName = baseName;

            if (field != null) {
                JsonProperty jp = field.getAnnotation(JsonProperty.class);
                if (jp != null && !jp.value().isEmpty()) {
                    jsonName = jp.value();
                }
            }

            if (sb.length() > 0) sb.append('.');
            sb.append(jsonName).append(indexPart);

            if (field != null) {
                currentClass = determineNextClass(field);
            } else {
                currentClass = null;
            }
        }
        return sb.toString();
    }

    private Field findFieldInHierarchy(Class<?> clazz, String name) {
        if (clazz == null) return null;
        Class<?> current = clazz;
        while (current != null && current != Object.class) {
            try {
                Field f = current.getDeclaredField(name);
                return f;
            } catch (NoSuchFieldException ignored) {
                current = current.getSuperclass();
            }
        }
        return null;
    }

    private Class<?> determineNextClass(Field field) {
        Class<?> type = field.getType();
        if (type.isArray()) {
            return type.getComponentType();
        }
        if (Collection.class.isAssignableFrom(type)) {
            Type gen = field.getGenericType();
            if (gen instanceof ParameterizedType) {
                Type[] args = ((ParameterizedType) gen).getActualTypeArguments();
                if (args.length > 0) {
                    Type arg = args[0];
                    if (arg instanceof Class) return (Class<?>) arg;
                    if (arg instanceof ParameterizedType) return (Class<?>) ((ParameterizedType) arg).getRawType();
                }
            }
            return Object.class;
        }
        return type;
    }
}
