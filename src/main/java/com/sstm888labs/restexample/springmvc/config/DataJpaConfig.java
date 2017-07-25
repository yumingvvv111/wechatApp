package com.sstm888labs.restexample.springmvc.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackages = {"com.sstm888labs.restexample.springmvc"})
public class DataJpaConfig {


}
