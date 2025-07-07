package dev.kimbank.iload.domain.file.entity;

import dev.kimbank.iload.domain.vehicle.entity.RegisteredVehicle;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "registered_vehicle_photo")
public class RegisteredVehiclePhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "registered_vehicle_photo_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registered_vehicle_id", nullable = false)
    @Comment("차량 등록 테이블 ID")
    private RegisteredVehicle registeredVehicle;

    @Column(name = "file_path", length = 1024)
    @Comment("차량 사진 경로")
    private String filePath;

    @Column(name = "file_name")
    @Comment("차량 사진 이름")
    private String fileName;

    @Column(name = "file_size")
    @Comment("차량 사진 사이즈")
    private Long fileSize;

    @Column(name = "file_content_type")
    @Comment("차량 사진 콘텐츠 타입")
    private String fileContentType;

    @Column(name = "file_url", length = 1024)
    @Comment("차량 사진 URL")
    private String fileUrl;

    @CreationTimestamp
    @Column(name = "created_at")
    @Comment("등록 일시")
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @Comment("수정 일시")
    private Instant updatedAt;
}
