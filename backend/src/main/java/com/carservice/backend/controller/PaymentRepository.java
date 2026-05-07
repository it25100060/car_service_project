package com.carservice.backend.repository;

import com.carservice.backend.model.Payment;
import com.carservice.backend.util.FileUtil;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class PaymentRepository {
    private static final String FILE_NAME = "payments.txt";

    public List<Payment> findAll() {
        return FileUtil.readLines(FILE_NAME).stream()
                .map(Payment::fromFileString)
                .collect(Collectors.toList());
    }

    public Optional<Payment> findById(String id) {
        return findAll().stream()
                .filter(p -> p.getId().equals(id))
                .findFirst();
    }

    public Payment save(Payment payment) {
        List<Payment> payments = findAll();
        payments.removeIf(p -> p.getId().equals(payment.getId()));
        payments.add(payment);
        FileUtil.writeLines(FILE_NAME, payments.stream().map(Payment::toFileString).collect(Collectors.toList()));
        return payment;
    }

    public void deleteById(String id) {
        List<Payment> payments = findAll();
        payments.removeIf(p -> p.getId().equals(id));
        FileUtil.writeLines(FILE_NAME, payments.stream().map(Payment::toFileString).collect(Collectors.toList()));
    }
}
