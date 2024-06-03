export class HttpPresenter {
  public static success<SuccessType>(data: SuccessType) {
    return {
      status: "success",
      data,
    };
  }
}
