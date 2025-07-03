
export const asyncHandler = (fn: Function) => {
    return (req: any, res: any, next: any) => {
        Promise.resolve(fn(req, res, next))
            .catch((error:any)=>next(error));
    };
}