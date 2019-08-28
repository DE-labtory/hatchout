/*
 * Copyright 2019 DE-labtory
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include <eosiolib/eosio.hpp>
#include <eosiolib/asset.hpp>
#include <eosiolib/time.hpp>
#include <eosiolib/singleton.hpp>
#include <eosiolib/crypto.hpp>
#include <eosiolib/print.hpp>
#include <string>
#include <vector>

using namespace eosio;
using std::string;
using std::vector;
typedef uint64_t id_type;

CONTRACT ghost : public contract {
    public:
        ghost( name self, name first_receiver, datastream<const char*> ds )
		: contract( self, first_receiver, ds ), _info( self, self.value ) {
            _info_state = _info.exists() ? _info.get() : state{};
        }
        ~ghost() {
            _info.set( _info_state, get_self() );
        }

        ACTION init( const public_key &key );

        ACTION issue( name to, asset quantity, string memo );

        ACTION burn( name owner, asset quantity, string memo );

        ACTION burnfrom( name burner, name owner, asset quantity, string memo );

        ACTION transfer( name from, name to, asset quantity, string memo );
    
        ACTION approve( name owner, name spender, asset quantity );

        ACTION transferfrom( name spender, name from, name to, asset quantity, string memo );

        ACTION incallowance( name owner, asset quantity );

        ACTION decallowance( name owner, asset quantity );

        ACTION open( name owner, const symbol& symbol, name ram_payer );

        ACTION close( name owner, const symbol& symbol );

        ACTION createegg( name to, id_type gene, name token_name, const signature &sig, string memo );

        ACTION levelup( name owner, id_type gene, uint8_t level, const signature &sig );

        ACTION burnnft( name owner, vector<id_type> genes, string memo );

        ACTION burnnftfrom( name burner, id_type gene, string memo );

        ACTION send( name from, name to, id_type gene, string memo );

        ACTION approvenft( name owner, name spender, id_type gene );

        ACTION sendfrom( name spender, name to, id_type gene, string memo );

        ACTION auction( name auctioneer, id_type gene, asset min_price, uint32_t sec );

        ACTION bid( name bidder, id_type gene, asset bid );

        ACTION claim( name requester, id_type gene );

        // dummy action
        ACTION bidresult( const asset& bid_key_currency ) { };

        using bidresult_action = action_wrapper<"bidresult"_n, &ghost::bidresult>;

        static asset get_supply( name token_contract_account ) {
            info_singleton _info( token_contract_account, token_contract_account.value );
            const auto& st = _info.get();
            return st.supply;
        }

        static asset get_balance( name token_contract_account, name owner, symbol_code sym_code ) {
            accounts accountstable( token_contract_account, owner.value );
            const auto& ac = accountstable.get( sym_code.raw() );
            return ac.balance;
        }

        const char* charmap = "0123456789";

        string uint64_to_string( const uint64_t& value ) {
            std::string result;
            result.reserve( 20 ); // uint128_t has 40 
            uint128_t helper = value;

            do {
                result += charmap[ helper % 10 ];
                helper /= 10;
            } while ( helper );
            std::reverse( result.begin(), result.end() );
            return result;
        }

    private:
        struct [[eosio::table("info")]] state {
            asset supply       = asset{0, symbol(symbol_code("SOUL"), 0)};
            asset ghost_supply = asset{0, symbol(symbol_code("GHOST"), 0)};
            public_key pub_key;
        };

        TABLE account {
            asset balance;

            uint64_t primary_key() const { return balance.symbol.code().raw(); }
        };

        TABLE allowance {
            asset    balance;
            name     spender;

            uint64_t primary_key() const { return balance.symbol.code().raw(); }
        };

        TABLE ghost {
            id_type gene;        // Unique 64 bit identifier,
            name    owner;  	 // token owner
	        name    tokenName;	 // token name
            uint8_t level;       // token level
            name    spender;     // token spender

            id_type     primary_key() const { return gene; }
            uint64_t    get_owner() const { return owner.value; }
        };

        TABLE ghost_bid {
            id_type         gene;
            name            high_bidder;
            int64_t         high_bid = 0;
            time_point_sec  deadline;

            id_type     primary_key() const { return gene; }
        };

        typedef eosio::singleton< "info"_n, state > info_singleton;

        typedef eosio::multi_index<"accounts"_n, account> accounts;

        typedef eosio::multi_index<"allowances"_n, allowance > allowances;

        typedef eosio::multi_index<"ghost"_n, ghost,
                                    indexed_by< "byowner"_n, const_mem_fun< ghost, uint64_t, &ghost::get_owner> >
                                    > ghosts;

        typedef eosio::multi_index< "ghostbids"_n, ghost_bid> ghost_bids;

        info_singleton  _info;

        state           _info_state;

        void sub_balance(name owner, asset value);
        void add_balance(name owner, asset value, name ram_payer);
};