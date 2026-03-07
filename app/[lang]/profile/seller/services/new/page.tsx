import ServiceFormPage from "../_components/service-form";

function NewService() {
  return (
    <div className="pb-20">
      <h2 className="text-primary font-semibold mb-6">Add New Service</h2>
      <ServiceFormPage />
    </div>
  );
}

export default NewService;
