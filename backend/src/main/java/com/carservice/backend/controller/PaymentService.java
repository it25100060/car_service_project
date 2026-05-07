package com.carservice.backend.service;

import com.carservice.backend.model.Payment;
import com.carservice.backend.repository.PaymentRepository;
import com.carservice.backend.util.IDGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    public Payment processPayment(Payment payment) {
        payment.setId(IDGenerator.generate("P"));
        payment.setStatus("PAID");
        // Return payment object without database access - file persistence is handled separately
        return payment;
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}
