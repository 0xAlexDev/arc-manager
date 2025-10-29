package com.arc_manager.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "loot_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LootItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(name = "image_b64", columnDefinition = "TEXT")
    private String imageB64;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private String rarity;

    @Column(nullable = false)
    private boolean sellable;

    @Column(nullable = false)
    private boolean buyable;

    @Column(nullable = false)
    private boolean forHideout;

    @Column(nullable = false)
    private boolean forMission;

    @Column(nullable = false)
    private boolean forCrafting;

    @Column(nullable = false)
    private int priority;

    @Column(columnDefinition = "TEXT")
    private String note;
}

