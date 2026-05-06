package com.carservice.backend.util;

import java.util.UUID;

public class IDGenerator {
    public static String generate(String prefix) {
        return prefix + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
