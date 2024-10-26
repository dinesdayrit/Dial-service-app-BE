import { Request, Response } from "express";
import ServiceProvider from "../models/ServiceProvider";

const getAllServiceProviders = async (req: Request, res: Response) => {
  console.log("getting all service Providers");
  try {
    const serviceProviders = await ServiceProvider.find().lean();
    res.json(serviceProviders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const getServiceProvider = async (req: Request, res: Response) => {
  try {
    const serviceProviderId = req.params.serviceProviderId;

    const serviceProvider = await ServiceProvider.findById(serviceProviderId);
    if (!serviceProvider) {
      return res.status(404).json({ message: "serviceProvider not found" });
    }

    res.json(serviceProvider);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const searchServiceProvider = async (req: Request, res: Response) => {
  console.log(req.params);
  try {
    const city = req.params.city;

    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedSectors = (req.query.selectedSectors as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    let query: any = {};

    query["city"] = new RegExp(city, "i");
    const cityCheck = await ServiceProvider.countDocuments(query);
    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    }

    if (selectedSectors) {
      const ServiceSectorsArray = selectedSectors
        .split(",")
        .map((sector) => new RegExp(sector, "i"));

      query["serviceSectors"] = { $all: ServiceSectorsArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { serviceProviderName: searchRegex },
        { seriviceSector: { $in: [searchRegex] } },
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // sortOption = "lastUpdated"
    const serviceProvider = await ServiceProvider.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await ServiceProvider.countDocuments(query);

    const response = {
      data: serviceProvider,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };
    console.log(response);

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export default {
  getAllServiceProviders,
  getServiceProvider,
  searchServiceProvider,
};
