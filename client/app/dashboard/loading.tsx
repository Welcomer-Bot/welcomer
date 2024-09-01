import { Card, CardBody, CardFooter } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";

export default function Loading() {
  return (
    <>
    {
      Array.from({length:5}).map((_, index) => {
        <Card
          key={index}
          className="w-[350] relative radius-8 mb-10 min-w-60 justify-evenly mx-4"
        >
          <CardBody className="p-0 flex justify-center">
            <Skeleton>
              <div
              className="h-[120px] w-full rounded-8"
              />
            </Skeleton>
          </CardBody>
          <CardFooter className="flex items-center justify-between">
            <Skeleton>
              <div className="flex flex-row items-center">
                <div className="w-12 h-12 border-solid border-2 border-white shadow-2xl rounded-large flex justify-center items-center mr-3" />
              </div>
            </Skeleton>
            <Skeleton>
              <div className="w-24 h-6 rounded-8" />
            </Skeleton>
          </CardFooter>
        </Card>;
      })
    }
    </>
  );
}
