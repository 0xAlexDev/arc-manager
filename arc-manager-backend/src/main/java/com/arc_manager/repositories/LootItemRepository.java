package com.arc_manager.repositories;

import com.arc_manager.domain.entities.LootItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LootItemRepository extends JpaRepository<LootItem, Long> {

}