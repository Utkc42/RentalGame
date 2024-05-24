import { Controller, useForm } from "react-hook-form";
import { /* useEffect, */ useState } from "react";
import Select from "react-select";
import { consoleTypes } from "../../assets/consoleTypes.json";
import { useUser } from "../../context/UserContext";

const AddGameForm = () => {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState("");
  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
  } = useForm({
    mode: "onChanges",
    reValidateMode: "onChange",
  });

  const dbCategories = [
    "Action",
    "Adventure",
    "Role-Playing",
    "Simulation",
    "Strategy",
    "Sports",
    "Puzzle",
    "Idle",
    "Educational",
    "Music",
    "Racing",
    "Shooter",
    "Fighting",
    "Horror",
  ];

  const onFormSubmit = async (data) => {
    data.category = selectedCategory;
    data.isAvailable = true;
    data.isDeleted = false;
    try {
      const postUrl = import.meta.env.VITE_BACKEND_URL + "/api/games";
      const response = await fetch(postUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      console.log("responseData: ", responseData);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const years = [];
  for (let i = new Date().getFullYear(); i >= 1960; i--) {
    years.push(i);
  }
  years.push("Before 1960");
  years.push("Unknown");

  const registerOptions = {
    name: {
      required: "Please enter the title",
      minLength: {
        value: 3,
        message: "The title must have at least 3 characters",
      },
    },
    releaseYear: {
      required: "Please enter the release year",
      valueAsNumber: true,
    },
    publisher: {
      required: "Please enter the publisher",
    },
    consoleType: {
      required: "Please select the platform",
    },
    coverImage: {
      pattern: {
        value: /\.(?:png|jpg|jpeg|gif)$/,
        message: "Please enter a valid image URL",
      },
    },
    description: {
      required: "Please enter the description",
      minLength: {
        value: 10,
        message: "The description must have at least 10 characters",
      },
    },
    categories: {
      required: "Please select a category",
    },
    rentalPricePerWeek: {
      required: "Please enter the rental price",
      valueAsNumber: true,
    },
    numberOfCopies: {
      required: "Please enter the number of copies",
      valueAsNumber: true,
    },
    isDeleted: {},
    isAvailable: {},
  };

  const handleCategoryToggle = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(category);
    }
  };

  const labelStyle =
    "block uppercase tracking-wide text-white text-xs font-bold mb-2";
  const inputStyle =
    "appearance-none block w-full bg-gray-200 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-teal-900";
  const buttonStyle =
    "bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-full mr-2 mb-2 hover:bg-gray-300";

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="m-4 w-full gap-4 bg-gray-800 p-4 rounded-lg text-left grid grid-cols-2"
    >
      <h2 className="text-white text-2xl font-bold text-center mb-4 col-span-2">
        Add a Game
      </h2>
      <div>
        <label className={labelStyle} htmlFor="name">
          Title
        </label>
        <input
          className={inputStyle}
          type="text"
          name="name"
          placeholder="Metal Gear Solid"
          {...register("name", registerOptions.name)}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label className={labelStyle} htmlFor="releaseYear">
          Release Year
        </label>
        <select
          className={inputStyle}
          name="releaseYear"
          {...register("releaseYear", registerOptions.releaseYear)}
        >
          <option value="">Select year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        {errors.releaseYear && (
          <p className="text-red-500">{errors.releaseYear.message}</p>
        )}
      </div>
      <div>
        <label className={labelStyle} htmlFor="publisher">
          Publisher
        </label>
        <input
          className={inputStyle}
          type="text"
          name="publisher"
          placeholder="Konami"
          {...register("publisher", registerOptions.publisher)}
        />
        {errors.publisher && (
          <p className="text-red-500">{errors.publisher.message}</p>
        )}
      </div>
      <div>
        <label className={labelStyle} htmlFor="consoleType">
          Platform
        </label>
        <Controller
          name="consoleType"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={consoleTypes.map((consoleType) => ({
                value: consoleType,
                label: consoleType,
              }))}
              onChange={(selectedOption) =>
                field.onChange(selectedOption.value)
              }
              value={
                field.value ? { value: field.value, label: field.value } : null
              }
              placeholder="Select platform"
            />
          )}
          rules={{ required: true }}
        />
        {errors.consoleType && (
          <p className="text-red-500">Please select the platform</p>
        )}
      </div>
      <div>
        <label className={labelStyle} htmlFor="coverImage">
          Image URL
        </label>
        <input
          className={inputStyle}
          type="text"
          name="coverImage"
          placeholder="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png"
          {...register("coverImage", registerOptions.coverImage)}
        />
        {errors.coverImage && (
          <p className="text-red-500">{errors.coverImage.message}</p>
        )}
      </div>
      <div>
        <label className={labelStyle} htmlFor="description">
          Description
        </label>
        <textarea
          className={inputStyle}
          type="text"
          name="description"
          placeholder="A groundbreaking stealth-action game in which players take on the role of Solid Snake and must prevent a nuclear disaster."
          {...register("description", registerOptions.description)}
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>
      <div>
        <label className={labelStyle} htmlFor="categories">
          Categories
        </label>
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <div>
              {dbCategories.map((category, key) => (
                <button
                  key={key}
                  type="button"
                  className={`${buttonStyle} ${
                    selectedCategory.includes(category)
                      ? "bg-green-500 text-white hover:bg-green-500"
                      : "bg-gray-400 text-gray-800"
                  }`}
                  onClick={() => {
                    handleCategoryToggle(category);
                    field.onChange(category);
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
          rules={registerOptions.categories}
        />
        {errors.categories && (
          <p className="text-red-500">{errors.categories.message}</p>
        )}
      </div>
      <div>
        <label className={labelStyle} htmlFor="rentalPricePerWeek">
          Rental Price per Week
        </label>
        <input
          className={inputStyle}
          type="number"
          step="0.01"
          name="rentalPricePerWeek"
          placeholder="2.49"
          {...register(
            "rentalPricePerWeek",
            registerOptions.rentalPricePerWeek,
            {
              setValueAs: (value) => parseFloat(value).toFixed(2),
            }
          )}
        />
        {errors.rentalPricePerWeek && (
          <p className="text-red-500">{errors.rentalPricePerWeek.message}</p>
        )}
      </div>
      <input
        type="submit"
        value="Add Game"
        className="block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mx-auto col-span-2"
      />
    </form>
  );
};

export default AddGameForm;
