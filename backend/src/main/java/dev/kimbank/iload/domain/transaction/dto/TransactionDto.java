package dev.kimbank.iload.domain.transaction.dto;

import lombok.Value;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link dev.kimbank.iload.domain.transaction.entity.Transaction}
 */
@Value
public class TransactionDto implements Serializable {
    Long id;
    Instant createdAt;
    Instant updatedAt;
}