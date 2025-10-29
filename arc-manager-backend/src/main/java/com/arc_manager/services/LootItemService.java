package com.arc_manager.services;

import com.arc_manager.domain.entities.LootItem;
import com.arc_manager.repositories.LootItemRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Service
@Validated
@Slf4j
public class LootItemService{

    private final LootItemRepository lootItemRepository;

    @Autowired
    public LootItemService(
            LootItemRepository lootItemRepository
    ){
        this.lootItemRepository = lootItemRepository;
    }

    public List<LootItem> getAll(){
        return lootItemRepository.findAll();
    }

    public LootItem create(LootItem lootItem){
        return lootItemRepository.save(lootItem);
    }

    public LootItem update(Long id, LootItem lootItem){
        return lootItemRepository.save(lootItem);
    }

    public LootItem delete(Long id){
        LootItem lootItemToDelete = lootItemRepository.findById(id).get();
        lootItemRepository.delete(lootItemToDelete);
        return lootItemToDelete;
    }
}
