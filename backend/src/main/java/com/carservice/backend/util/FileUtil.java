package com.carservice.backend.util;

import java.io.*;
import java.nio.file.*;
import java.util.*;

public class FileUtil {
    private static final String DATA_DIR = "src/main/resources/data/";

    public static void ensureDataDir() {
        try {
            Files.createDirectories(Paths.get(DATA_DIR));
        } catch (IOException e) {
            throw new RuntimeException("Could not create data directory", e);
        }
    }

    public static List<String> readLines(String fileName) {
        Path path = Paths.get(DATA_DIR + fileName);
        if (!Files.exists(path)) {
            return new ArrayList<>();
        }
        try {
            return Files.readAllLines(path);
        } catch (IOException e) {
            throw new RuntimeException("Error reading file: " + fileName, e);
        }
    }

    public static void writeLines(String fileName, List<String> lines) {
        try {
            ensureDataDir();
            // Join lines with system line separator to maintain proper formatting
            String content = String.join(System.lineSeparator(), lines);
            if (!lines.isEmpty()) {
                content += System.lineSeparator(); // Add final newline
            }
            Files.write(Paths.get(DATA_DIR + fileName), content.getBytes(), 
                StandardOpenOption.CREATE, StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Error writing to file: " + fileName, e);
        }
    }

    public static void appendLine(String fileName, String line) {
        try {
            Files.write(Paths.get(DATA_DIR + fileName), (line + System.lineSeparator()).getBytes(), 
                StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException e) {
            throw new RuntimeException("Error appending to file: " + fileName, e);
        }
    }
}
