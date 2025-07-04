package dev.kimbank.iload.domain.vehicle.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "registered_vehicle_photo")
public class RegisteredVehiclePhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "registered_vehicle_photo_id", nullable = false)
    private Long id;

    @Column(name = "photo_url", length = 500)
    @Comment("차량 사진 URL")
    private String photoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registered_vehicle_id", nullable = false)
    @Comment("차량 등록 테이블 ID")
    private RegisteredVehicle registeredVehicle;

    @CreationTimestamp
    @Column(name = "created_at")
    @Comment("등록 일시")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @Comment("수정 일시")
    private LocalDateTime updatedAt;
}
