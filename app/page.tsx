"use client"
import { CarCard, CustomFilter, Hero, SearchBar } from "@/components";
import ShowMore from "@/components/ShowMore";
import { fuels, yearsOfProduction } from "@/constants";
import { HomeProps } from "@/types";
import { fetchCars } from "@/utils";
import { useState, useEffect } from 'react'
import Image from "next/image";
export default function Home() {

  const [allCars, setAllCars] = useState([])
  const [loading, setLoading] = useState(false)
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("")
  //filter states
  const [fule, setFule] = useState("")
  const [year, setYear] = useState()

  const getCars = async () => {
    setLoading(true)
    try {
      const result = await fetchCars({
        manufacturer: manufacturer || "",
        year: year || 2022,
        fuel: fule || "",
        limit: limit || 10,
        model: model || "",
      });
      setAllCars(result)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  //Pagination states
  const [limit, setLimit] = useState(10)
  useEffect(() => {
    getCars()
  }, [manufacturer, fule, limit, year, model])


  return (
    <main className='overflow-hidden'>
      <Hero />

      <div className='mt-12 padding-x padding-y max-width' id='discover'>
        <div className='home__text-container'>
          <h1 className='text-4xl font-extrabold'>Car Catalogue</h1>
          <p>Explore out cars you might like</p>
        </div>

        <div className='home__filters'>
          <SearchBar setManufacturer={setManufacturer} setModel={setModel} />

          <div className='home__filter-container'>
            <CustomFilter title='fuel' options={fuels} setFilter={setFule} />
            <CustomFilter title='year' options={yearsOfProduction} setFilter={setYear} />
          </div>
        </div>

        {allCars.length > 0 ? (
          <section>
            <div className='home__cars-wrapper'>
              {allCars?.map((car) => (
                <CarCard car={car} />
              ))}
            </div>
            {loading && (
              <div className="flex justify-center items-center mt-8">
                <Image src="/loader.svg" alt="loader" width={50} height={50} className="object-contain" />
              </div>
            )}
            <ShowMore
              pageNumber={(limit || 10) / 10}
              isNext={(limit || 10) > allCars.length}
              setLimit={setLimit}
            />
          </section>
        ) : (
          <div className='home__error-container'>
            <h2 className='text-black text-xl font-bold'>Oops, no results</h2>
            <p>{allCars?.message}</p>
          </div>
        )}
      </div>
    </main>
  );
}