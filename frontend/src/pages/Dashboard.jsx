import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";
import MyRequestsPage from "./MyRequestsPage";
import WalletPage from "./WalletPage.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { authApi, requestsApi, walletApi, notificationsApi } from "../lib/supabase.js";
import 
