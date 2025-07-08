package dev.kimbank.iload.domain.transaction.entity;

import dev.kimbank.iload.domain.transaction.entity.enums.CountryEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "transaction")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id", nullable = false)
    private Long id;

    @Column(name = "vehicle_name", length = 100)
    @Comment("차량 명")
    private String vehicleName;

    @Column(name = "price")
    @Comment("거래 금액")
    private Long price;

    @Column(name = "country", length = 50)
    @Comment("거래 국가")
    private CountryEnum country;

    @Column(name = "release_year")
    @Comment("연식")
    private Integer releaseYear;

    @Column(name = "mileage")
    @Comment("주행거리")
    private Integer mileage;

    @Column(name = "date")
    @Comment("거래 일자")
    private LocalDate date;

    @CreationTimestamp
    @Column(name = "created_at")
    @Comment("등록 일시")
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @Comment("수정 일시")
    private Instant updatedAt;
}
