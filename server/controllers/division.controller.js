import divisionService from "../service/division.service.js";

class DivisionController {
  async read(req, res, next){
    try {
      const data = await divisionService.read();
      return res.json(data)
    } catch (e) {
      next(e);
    }
  }

  async readNode(req, res, next){
    try {
      const id = req.query.id;
      const data = await divisionService.readNode(id);
      return res.json(data)
    } catch (e) {
      next(e);
    }
  }

  async divisionPush(req, res, next){
    try {
      const division = req.body;
      const data = division.id === null ?
        await divisionService.divisionPush(division) :
        await divisionService.divisionUpdate(division);
      return res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async divisionDrop(req, res, next){
    try {
      const id = req.query.id;
      const result = await divisionService.divisionDrop(id);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

export default new DivisionController();