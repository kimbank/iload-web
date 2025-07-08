package dev.kimbank.iload.domain.transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

/**
 * DTO for {@link dev.kimbank.iload.domain.transaction.entity.Transaction}
 */
@Data
@AllArgsConstructor
public class TransactionSummary {
    Long id;
    Instant createdAt;
    Instant updatedAt;
}
