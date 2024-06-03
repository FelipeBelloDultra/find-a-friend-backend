import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Param } from "@nestjs/common";

import { PetNotFound } from "~/domain/pet/application/use-cases/errors/pet-not-found";
import { ShowPetDetail } from "~/domain/pet/application/use-cases/show-pet-detail";
import { Public } from "~/infra/auth/public";

import { HttpPresenter } from "../../presenters/http-presenter";
import { PetPresenter } from "../../presenters/pet-presenter";

@Controller("/pets/:id")
@Public()
export class ShowPetDetailController {
  public constructor(private readonly showPetDetail: ShowPetDetail) {}

  @Get()
  @HttpCode(200)
  public async handle(@Param("id") id: string) {
    const result = await this.showPetDetail.execute({
      petId: id,
    });

    if (result.isRight()) {
      const { pet } = result.value;

      return HttpPresenter.success(PetPresenter.toHTTP(pet));
    }

    switch (result.constructor) {
      case PetNotFound:
        throw new NotFoundException("Pet not found.");
      default:
        throw new BadRequestException(result.value.message); // TODO: Fix it
    }
  }
}
