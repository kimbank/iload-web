package dev.kimbank.iload.domain.vehicle.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DriveTypeEnum {
    // 이륜 구동
    TWO_WD("2WD", "2WD"),
    // 사륜 구동
    FOUR_WD("4WD", "4WD"),
    // 사륜 엔진 사륜구동
    AWD("AWD", "AWD"),
    // 전륜 엔진 전륜구동
    FF("FF", "FF"),
    // 전륜 엔진 전륜구동
    FR("FR", "FR"),
    // 전륜 엔진 후륜구동
    MR("MR", "MR"),
    // 후륜 엔진 후륜구동
    RMR("RMR", "RMR"),
    // 후륜엔진 후륜구동
    RR("RR", "RR"),
    // 후륜구동
    RWD("RWD", "RWD"),
    // 기타
    OTHER("OTHER", "기타");

    private final String code;
    private final String description;
}
