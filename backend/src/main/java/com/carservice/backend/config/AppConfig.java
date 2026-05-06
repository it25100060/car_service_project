package com.carservice.backend.config;

import com.carservice.backend.util.FileUtil;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class AppConfig {
    @PostConstruct
    public void init() {
        FileUtil.ensureDataDir();
    }
}
