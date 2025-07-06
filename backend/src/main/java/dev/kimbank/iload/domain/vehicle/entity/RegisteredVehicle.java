package dev.kimbank.iload.domain.vehicle.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import dev.kimbank.iload.domain.users.entity.Users;
import dev.kimbank.iload.domain.vehicle.entity.enums.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "registered_vehicle")
public class RegisteredVehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "registered_vehicle_id", nullable = false)
    private Long id;

    @JsonIgnore // JSON 직렬화에서 제외 (순환 참조 방지)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", nullable = false)
    @Comment("작성 유저 ID")
    private Users users;

    @Enumerated(EnumType.STRING)
    @Column(name = "manufacturer")
    @Comment("제조 기업")
    private ManufacturerEnum manufacturer;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type")
    @Comment("차량 유형")
    private VehicleTypeEnum vehicleType;

    @Column(name = "displacement")
    @Comment("배기량")
    private Integer displacement;

    @Column(name = "seater_count")
    @Comment("승차 인원")
    private Integer seaterCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type")
    @Comment("연료")
    private FuelTypeEnum fuelType;

    @Column(name = "vehicle_code")
    @Comment("차대번호")
    private String vehicleCode;

    @Column(name = "vehicle_number")
    @Comment("차량 번호 ex) 123가 4567")
    private String vehicleNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "manufacture_country")
    @Comment("제조 국가")
    private ManufactureCountryEnum manufactureCountry;

    @Column(name = "vehicle_grade")
    @Comment("차량등급")
    private String vehicleGrade;

    @Column(name = "release_price")
    @Comment("출고가격")
    private Integer releasePrice;

    @Column(name = "mileage")
    @Comment("주행거리")
    private Integer mileage;

    @Column(name = "release_year")
    @Comment("연식")
    private Integer releaseYear;

    @Column(name = "manufacture_year")
    @Comment("제조 년도")
    private Integer manufactureYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "accident_info")
    @Comment("사고 정보")
    @ColumnDefault("NULL")
    private AccidentInfoEnum accidentInfo;

    @Enumerated(EnumType.STRING)
    @Column(name = "repainted")
    @Comment("도색 여부")
    private RepaintedEnum repainted;

    @Enumerated(EnumType.STRING)
    @Column(name = "drive_type")
    @Comment("구동 방식")
    private DriveTypeEnum driveType;

    @Enumerated(EnumType.STRING)
    @Column(name = "transmission")
    @Comment("변속기")
    private TransmissionEnum transmission;

    @Enumerated(EnumType.STRING)
    @Column(name = "color")
    @Comment("색상")
    private ColorEnum color;

    @Column(name = "initial_registration_date")
    @Comment("최초 등록")
    private LocalDate initialRegistrationDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "special_use_history")
    @Comment("특수 사용 이력")
    private SpecialUseHistoryEnum specialUseHistory;

    @Enumerated(EnumType.STRING)
    @Column(name = "special_modification_history")
    @Comment("특수 개조 내역")
    private SpecialModificationHistoryEnum specialModificationHistory;

    @Enumerated(EnumType.STRING)
    @Column(name = "option_info")
    @Comment("옵션 정보")
    private OptionInfoEnum optionInfo;

    @OneToMany(mappedBy = "registeredVehicle", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Comment("차량 등록증")
    private List<VehicleRegistrationCertificate> vehicleRegistrationCertificates;

    @OneToMany(mappedBy = "registeredVehicle", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Comment("등록된 차량 사진")
    private List<RegisteredVehiclePhoto> registeredVehiclePhotos;

    @Column(name = "selling_price")
    @Comment("판매 희망 가격")
    private Integer sellingPrice;

    @CreationTimestamp
    @Column(name = "created_at")
    @Comment("등록 일시")
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @Comment("수정 일시")
    private Instant updatedAt;
}
