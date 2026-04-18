package com.flightbooking.bookingservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    // By declaring RestTemplate as a @Bean, Spring manages its lifecycle
    // and we can @Autowire or inject it anywhere in the application.
    // Without this, we'd have to manually create "new RestTemplate()" every time,
    // which is messy and hard to test.
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}