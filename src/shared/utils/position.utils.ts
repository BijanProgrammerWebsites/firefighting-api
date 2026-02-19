import { Repository } from "typeorm";

type MoveableEntity = {
  id: string;
  position: number;
};

export async function moveEntities<Entity extends MoveableEntity>(
  repo: Repository<Entity>,
  active: Entity,
  over: Entity,
): Promise<Entity[]> {
  const entities = await repo
    .createQueryBuilder("entity")
    .where("entity.position BETWEEN :min AND :max", {
      min: Math.min(active.position, over.position),
      max: Math.max(active.position, over.position),
    })
    .getMany();

  for (const entity of entities) {
    if (entity.id === active.id) {
      continue;
    }

    if (entity.position < active.position) {
      entity.position++;
    } else {
      entity.position--;
    }
  }

  active.position = over.position;

  return entities;
}

export async function getMaxPosition<Entity extends MoveableEntity>(
  repo: Repository<Entity>,
  parentLabel: string,
  parentValue: string,
): Promise<number> {
  const { maxPosition } = await repo
    .createQueryBuilder("entity")
    .select("MAX(entity.position)", "maxPosition")
    .where(`entity.${parentLabel} = :${parentLabel}`, {
      [parentLabel]: parentValue,
    })
    .getRawOne();

  return maxPosition ?? 0;
}

// export async function moveItemToList(
//   activeItem: Item,
//   overListId: number,
// ): Promise<void> {
//   if (activeItem.list.id !== overListId) {
//     activeItem.list.id = overListId;
//
//     const maxPosition = await getMaxPositionAmongItems(overListId);
//     activeItem.position = maxPosition + 1;
//   }
// }

// export async function getMaxPositionAmongItems(
//   listId: number,
// ): Promise<number> {
//   const itemRepo = dataSource.getRepository(Item);
//
//   const { maxPosition } = await itemRepo
//     .createQueryBuilder("item")
//     .select("MAX(item.position)", "maxPosition")
//     .where("item.listId = :listId", { listId })
//     .getRawOne();
//
//   return maxPosition ?? 0;
// }
