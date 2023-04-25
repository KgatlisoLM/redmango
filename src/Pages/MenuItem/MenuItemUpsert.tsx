import React, { useEffect, useState } from "react";
import { inputHelper, toastNotify } from "../../Helper";
import { useCreateMenuItemMutation, useGetMenuItemByIdQuery, useUpdateMenuItemMutation } from "../../apis/menuItemApi";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import { SD_Category } from "../../Utility/SD";

const Categories = [
    SD_Category.APPETIZER,
    SD_Category.BEVERAGES,
    SD_Category.DESSERT,
    SD_Category.ENTREE,
];

const menuItemData = {
  name: "",
  description: "",
  specialTag: "",
  category: Categories[0],
  price:"",
};



function MenuItemUpsert() {
 const { id } = useParams();
 const navigate = useNavigate();
 const [imageToStore, setImageToStore] = useState<any>();
 const [imageToDisplay, setImageToDisplay] = useState<string>("");
 const [menuItemInputs, setMenuItemInputs] = useState(menuItemData);
 const [loading, setLoading] = useState(false);
 const [createMenuItem] = useCreateMenuItemMutation();
 const [ updateMenuItem ] = useUpdateMenuItemMutation();
 const { data } = useGetMenuItemByIdQuery(id);


 useEffect(() => {
    if(data && data.result){
        const tempData = {
            name: data.result.name,
            description: data.result.description,
            specialTag: data.result.specialTag,
            category: data.result.category,
            price: data.result.price,
        };
        setMenuItemInputs(tempData);
        setImageToDisplay(data.result.image);
    }
 }, [data])
    
 const handleMenuItemInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const tempData = inputHelper(e, menuItemInputs);
    setMenuItemInputs(tempData); 
 };

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files && e.target.files[0];
    if(file){
        console.log(file);
        const imgType = file.type.split("/")[1];
        const validImgTypes = ["jpeg", "jpg", "png"];

        const isImageTypeValid = validImgTypes.filter((e) => {
            return e  === imgType;
        });

        if(file.size > 1000 * 1024){
            setImageToStore("");
            toastNotify("Image Must be less then 1 MB", "error");
            return;
        }else if(isImageTypeValid.length === 0){
            setImageToStore("");
            toastNotify("Image must be in jpeg, jpg or png", "error");
            return;
        };

        const reader = new FileReader();
        reader.readAsDataURL(file);
        setImageToStore(file);
        reader.onload = (e) => {
            const imageUrl = e.target?.result as string;
            setImageToDisplay(imageUrl);
        }
    };

 };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if(!imageToStore && !id){
        toastNotify("please upload an image", "error");
        setLoading(false);
        return;
    };

    const formData = new FormData();
    formData.append("Name", menuItemInputs.name);
    formData.append("Description", menuItemInputs.description);
    formData.append("SpecialTag", menuItemInputs.specialTag ?? "");
    formData.append("Category", menuItemInputs.category);
    formData.append("Price", menuItemInputs.price);
    if(imageToDisplay) formData.append("File", imageToStore);

    let response;

    if(id){
        //update
        formData.append("Id", id);
        response = await updateMenuItem({data: formData, id}); 
        if(response){
           toastNotify("Menu item updated successfully", "success");
        }

    }else{
        //create
       response = await createMenuItem(formData); 
       if(response){
         toastNotify("Menu item created successfully", "success");
       } 
    }
   
    if(response){
        setLoading(false);
        navigate("/menuItem/menuItemList");
    };

    setLoading(false);
 };


  return (
    <>
      <div className="container border mt-5 p-5 bg-light">
        {loading && <MainLoader/>}
        <h3 className="px-2 text-success">
            {id ? "Edit Menu Item": "Add Menu Item"}
        </h3>
        <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
          <div className="row mt-3">
            <div className="col-md-7">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                required
                name="name"
                value={menuItemInputs.name}
                onChange={handleMenuItemInput}
              />
              <textarea
                className="form-control mt-3"
                placeholder="Enter Description"
                name="description"
                rows={5}
                value={menuItemInputs.description}
                onChange={handleMenuItemInput}
              ></textarea>
              <input
                type="text"
                className="form-control mt-3"
                placeholder="Enter Special Tag"
                name="specialTag"
                value={menuItemInputs.specialTag}
                onChange={handleMenuItemInput}
              />
              <select
                className="form-control mt-3 form-select"
                placeholder="Enter Category"
                name="category"
                value={menuItemInputs.category}
                onChange={handleMenuItemInput}
              >
                {Categories.map((category) => (
                    <option value={category}>{category}</option>
                ))}
              </select>
              <input
                type="text"
                className="form-control mt-3"
                required
                placeholder="Enter Price"
                name="price"
                step=".01"
                pattern="^\d+([\.,]\d\d)?$"
                value={menuItemInputs.price}
                onChange={handleMenuItemInput}
              />
              <input 
               type="file" 
               className="form-control mt-3"
               accept="image/png, image/jpg, image/jpeg"
               onChange={handleFileChange}
               />
               <div className="row">
                <div className="col-6">
                <button
                  type="submit"
                  className="btn btn-success form-control mt-3"
                >
                  {id ? "Update" : "Create"}
                </button>
                </div>
                <div className="col-6">
                    <a onClick={()=> navigate("/menuItem/menuItemList")}
                       className="btn btn-secondary form-control mt-3">
                        Back to Menu Items
                    </a>
                </div>
               </div>
            </div>
            <div className="col-md-5 text-center">
              <img
                src={imageToDisplay}
                style={{ width: "100%", borderRadius: "30px" }}
                alt=""
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}


export default MenuItemUpsert;