import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient();

class DivisionService {
  async read() {
    const result = this.readNode(null);
    return result;
  }

  async readNode(id){
    const data = await prisma.division.findMany({
      where: {parent_id: id },
      orderBy: {
        id: 'asc'
      }
    });
    for (const node of data){
      node.childrens = await this.readNode(node.id);
    }
    return data;
  }

  async divisionPush(division){
    const result = await prisma.division.create({
      data: {
        name: division.name,
        parent_id: division.parent_id
      }
    });
    return result
  }

  async divisionUpdate(division){
    const result = await prisma.division.update({
      where: { id: division.id },
      data: {
        name: division.name
      }
    });
    return result;
  }

  async divisionDrop(id){

    const _id = parseInt(id);
    const division = await prisma.division.findFirst({
      where: { id: _id }
    });
    const childrens = await prisma.division.findMany({
      where: { parent_id: _id }
    });
    for (let i = 0; i < childrens.length; i++){
      await prisma.division.update({
        where: { id: childrens[i].id },
        data: { parent_id: division.parent_id }
      })
    }
    const result = await prisma.division.delete({
      where: { id: _id }
    });

    return result;
  }
}

export default new DivisionService();