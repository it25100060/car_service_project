package com.carservice.backend.controller;

import com.carservice.backend.model.Payment;
import com.carservice.backend.service.PaymentService;
import com.carservice.backend.util.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<?> processPayment(@RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.processPayment(payment));
    }

    @GetMapping
    public ResponseEntity<?> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @PostMapping("/save")
    public ResponseEntity<?> savePayment(@RequestBody PaymentRecord paymentRecord) {
        try {
            // Format: payment id,amount,date,card last 4 digits,service id,user id,booking id
            String csvLine = String.format("%s,%s,%s,%s,%s,%s,%s",
                paymentRecord.getPaymentId(),
                paymentRecord.getAmount(),
                paymentRecord.getDate(),
                paymentRecord.getCardLast4(),
                paymentRecord.getServiceId(),
                paymentRecord.getUserId(),
                paymentRecord.getBookingId()
            );
            
            FileUtil.appendLine("payments.txt", csvLine);
            
            java.util.Map<String, String> response = new java.util.HashMap<>();
            response.put("message", "Payment saved successfully");
            response.put("paymentId", paymentRecord.getPaymentId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving payment: " + e.getMessage());
        }
    }

    @PostMapping("/save-card")
    public ResponseEntity<?> saveCard(@RequestBody CardRecord cardRecord) {
        try {
            // Validate card details
            String cardNum = cardRecord.getCardNumber().replace(" ", "");
            
            // Check card number is numeric
            if (!cardNum.matches("^[0-9]+$")) {
                return ResponseEntity.badRequest().body("Card number must contain only digits");
            }
            
            // Check card number length (typically 13-19 digits)
            if (cardNum.length() < 13 || cardNum.length() > 19) {
                return ResponseEntity.badRequest().body("Card number must be 13-19 digits");
            }
            
            // Validate CVV is numeric
            if (!cardRecord.getCvv().matches("^[0-9]{3,4}$")) {
                return ResponseEntity.badRequest().body("CVV must be 3-4 numeric digits");
            }
            
            // Validate expiry date (MM/YY format and not expired)
            if (!cardRecord.getExpiry().matches("^[0-9]{2}/[0-9]{2}$")) {
                return ResponseEntity.badRequest().body("Expiry date must be in MM/YY format");
            }
            
            // Check if date is not expired
            String[] dateParts = cardRecord.getExpiry().split("/");
            int month = Integer.parseInt(dateParts[0]);
            int year = Integer.parseInt(dateParts[1]) + 2000; // Assuming 20YY format
            java.time.YearMonth cardDate = java.time.YearMonth.of(year, month);
            java.time.YearMonth today = java.time.YearMonth.now();
            
            if (cardDate.isBefore(today)) {
                return ResponseEntity.badRequest().body("Card has expired");
            }
            
            // Format: card_id,card_name,card_number,expiry_date,user_id
            String cardId = "C-" + System.currentTimeMillis();
            String csvLine = String.format("%s,%s,%s,%s,%s",
                cardId,
                cardRecord.getCardName(),
                cardNum,
                cardRecord.getExpiry(),
                cardRecord.getUserId() != null ? cardRecord.getUserId() : "unknown"
            );
            
            FileUtil.appendLine("saved_cards.txt", csvLine);
            
            java.util.Map<String, String> response = new java.util.HashMap<>();
            response.put("message", "Card saved successfully");
            response.put("cardId", cardId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving card: " + e.getMessage());
        }
    }

    @GetMapping("/get-cards")
    public ResponseEntity<?> getCards() {
        try {
            java.util.List<String> lines = FileUtil.readLines("saved_cards.txt");
            java.util.List<java.util.Map<String, String>> cards = new java.util.ArrayList<>();
            
            for (String line : lines) {
                String[] parts = line.split(",");
                if (parts.length >= 5) {
                    java.util.Map<String, String> card = new java.util.HashMap<>();
                    card.put("id", parts[0]);
                    card.put("cardName", parts[1]);
                    card.put("cardNumber", parts[2]);
                    card.put("expiry", parts[3]);
                    card.put("userId", parts[4]);
                    cards.add(card);
                }
            }
            
            return ResponseEntity.ok(cards);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching cards: " + e.getMessage());
        }
    }

    @PutMapping("/update-card")
    public ResponseEntity<?> updateCard(@RequestBody CardRecord cardRecord) {
        try {
            if (cardRecord.getId() == null || cardRecord.getId().isEmpty()) {
                return ResponseEntity.badRequest().body("Card ID is required");
            }

            // Validate card details
            String cardNum = cardRecord.getCardNumber().replace(" ", "");
            
            // Check card number is numeric
            if (!cardNum.matches("^[0-9]+$")) {
                return ResponseEntity.badRequest().body("Card number must contain only digits");
            }
            
            // Check card number length (typically 13-19 digits)
            if (cardNum.length() < 13 || cardNum.length() > 19) {
                return ResponseEntity.badRequest().body("Card number must be 13-19 digits");
            }
            
            // CVV is optional for updates (not stored anyway for security reasons)
            
            // Validate expiry date (MM/YY format and not expired)
            if (!cardRecord.getExpiry().matches("^[0-9]{2}/[0-9]{2}$")) {
                return ResponseEntity.badRequest().body("Expiry date must be in MM/YY format");
            }
            
            // Check if date is not expired
            String[] dateParts = cardRecord.getExpiry().split("/");
            int month = Integer.parseInt(dateParts[0]);
            int year = Integer.parseInt(dateParts[1]) + 2000;
            java.time.YearMonth cardDate = java.time.YearMonth.of(year, month);
            java.time.YearMonth today = java.time.YearMonth.now();
            
            if (cardDate.isBefore(today)) {
                return ResponseEntity.badRequest().body("Card has expired");
            }
            
            // Read all cards
            java.util.List<String> lines = FileUtil.readLines("saved_cards.txt");
            java.util.List<String> updatedLines = new java.util.ArrayList<>();
            boolean found = false;
            
            // Update the matching card
            for (String line : lines) {
                String[] parts = line.split(",");
                if (parts.length >= 5 && parts[0].equals(cardRecord.getId())) {
                    String updatedLine = String.format("%s,%s,%s,%s,%s",
                        cardRecord.getId(),
                        cardRecord.getCardName(),
                        cardNum,
                        cardRecord.getExpiry(),
                        parts[4]  // Keep original userId
                    );
                    updatedLines.add(updatedLine);
                    found = true;
                } else {
                    updatedLines.add(line);
                }
            }
            
            if (!found) {
                return ResponseEntity.badRequest().body("Card not found");
            }
            
            // Write updated cards back to file
            FileUtil.writeLines("saved_cards.txt", updatedLines);
            
            java.util.Map<String, String> response = new java.util.HashMap<>();
            response.put("message", "Card updated successfully");
            response.put("cardId", cardRecord.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating card: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-card/{cardId}")
    public ResponseEntity<?> deleteCard(@PathVariable String cardId) {
        try {
            if (cardId == null || cardId.isEmpty()) {
                return ResponseEntity.badRequest().body("Card ID is required");
            }

            // Read all cards
            java.util.List<String> lines = FileUtil.readLines("saved_cards.txt");
            java.util.List<String> updatedLines = new java.util.ArrayList<>();
            boolean found = false;

            // Filter out the card to delete
            for (String line : lines) {
                String[] parts = line.split(",");
                if (parts.length >= 1 && parts[0].equals(cardId)) {
                    found = true;
                    // Skip this line (delete it)
                } else {
                    updatedLines.add(line);
                }
            }

            if (!found) {
                return ResponseEntity.badRequest().body("Card not found");
            }

            // Write updated cards back to file
            FileUtil.writeLines("saved_cards.txt", updatedLines);

            java.util.Map<String, String> response = new java.util.HashMap<>();
            response.put("message", "Card deleted successfully");
            response.put("cardId", cardId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting card: " + e.getMessage());
        }
    }

    // Inner class for payment record DTO
    public static class PaymentRecord {
        private String paymentId;
        private Double amount;
        private String date;
        private String cardLast4;
        private String serviceId;
        private String userId;
        private String bookingId;

        // Getters and Setters
        public String getPaymentId() { return paymentId; }
        public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }

        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }

        public String getCardLast4() { return cardLast4; }
        public void setCardLast4(String cardLast4) { this.cardLast4 = cardLast4; }

        public String getServiceId() { return serviceId; }
        public void setServiceId(String serviceId) { this.serviceId = serviceId; }

        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }

        public String getBookingId() { return bookingId; }
        public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    }

    // Inner class for card record DTO
    public static class CardRecord {
        private String id;
        private String cardName;
        private String cardNumber;
        private String expiry;
        private String cvv;
        private String userId;

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getCardName() { return cardName; }
        public void setCardName(String cardName) { this.cardName = cardName; }

        public String getCardNumber() { return cardNumber; }
        public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

        public String getExpiry() { return expiry; }
        public void setExpiry(String expiry) { this.expiry = expiry; }

        public String getCvv() { return cvv; }
        public void setCvv(String cvv) { this.cvv = cvv; }

        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
    }
}
